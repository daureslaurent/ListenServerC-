#include "server.h"
#include "cmd_cpp.h"
#include <iostream>
#include <new>

Server::Server()
{}
Server::~Server()
{}
bool	Server::Run(const int port)
{
  if (!(_exit = Init(port)))
    return false;
  _listener = std::thread(std::bind(&Server::Listener, this));
}

void	Server::Wait_end()
{
  _listener.join();
}
bool	Server::Init(const int port)
{
  if (!_connection.Init(port))
    return false;
  return true;
}

//	--- Thread exec -- //

void	Server::Servlet(int c_fd, cmd_s* cmd_s)
{
  bool	exit = true;
  while (exit)
    {
      std::string	buf_in;
      std::string	buf_out;

      std::cout << "Servlet programe " << c_fd << std::endl;
      buf_in = _connection.Recv(c_fd);
      _rec.Push("Recv :", buf_in);

      if (buf_in.back() == '\n')
	{
	  size_t	size;

	  size = buf_in.size();
	  buf_in.erase(size-1, size);
	}

      buf_out = "NOTHING\n";
      if(cmd_s->run(buf_in))
	buf_out = cmd_s->get_ret();
      if (buf_out.compare("EXIT") == 0)
	{
	  exit = false;
	  buf_out = "EXIT_OK\n";
	}
      _connection.Send(buf_out, c_fd);
      _rec.Push("Send :", buf_out);

      buf_out.clear();
      buf_in.clear();
    }
  std::cout << "Close servelet on :" << c_fd << std::endl;
  close(c_fd);
}

void	Server::Listener()
{

  while (_exit)
    {
      std::string	ip_client;
      int		c_fd;


      std::cout << "Listener OP" << std::endl;
      c_fd = _connection.Accept();
      ip_client = _connection.Get_ip();
      std::cout << "-> " << ip_client << std::endl;
      _rec.Push("-> Connection :", ip_client);

      try
	{
	  cmd_s* cmd_sys = new cmd_s();
	  cmd_sys->Init(c_fd);
	  _list_thread.push_back(std::thread(std::bind(&Server::Servlet, this, c_fd, cmd_sys)));
	}
      catch (std::bad_alloc& ba)
	{
	  std::cerr << "bad_alloc caught: " << ba.what() << '\n';
	}
    }
}
