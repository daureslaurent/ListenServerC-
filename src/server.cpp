#include "server.h"
#include "cmd_cpp.h"
#include <iostream>
#include <new>

Server::Server()
{}
Server::~Server()
{}
//	--- Thread exec -- //

void	Server::Servlet(int c_fd, cmd_s* cmd_s)
{
  /*
  bool	exit = true;
  _connection.Send("HELLO\n", c_fd);

  while (exit)
    {
      std::string	buf_in;
      std::string	buf_out;

      std::cout << "Loop top"<< std::endl;
      buf_in = _connection.Recv(c_fd);
      if (buf_in.back() == '\n')
	{
	  size_t	size;

	  size = buf_in.size();
	  buf_in.erase(size-1, size);
	}
      if (buf_in.compare("monitor_c") == 0)
	buf_out = "WELCOME\n";
      else if (buf_in.compare("VERSION") == 0)
	buf_out = _version;
      else
	{
	  buf_out = "NOTHING\n";
	  if(cmd_s->run(buf_in))
	    buf_out = cmd_s->get_ret();
	  if (buf_out.compare("EXIT\n") == 0)
	    {
	      exit = false;
	      buf_out = "EXIT_FORCE\n";
	    }
	}
            std::cout << "Loop send"<< std::endl;
      _connection.Send(buf_out, c_fd);
      buf_out.clear();
      buf_in.clear();
    }
  std::cout << "Close servelet on :" << c_fd << std::endl;
  close(c_fd);
  */
}

void	Server::Listener()
{

  while (_exit)
    {
      std::string	ip_client;
      int		c_fd;

      c_fd = _connection.Accept();
      ip_client = _connection.Get_ip();
      if (!_connection.Islocal(ip_client))
	_rec.New_client(ip_client);

      try
	{
	  cmd_s* cmd_sys = new cmd_s();
	  cmd_sys->Init(c_fd);
	  client_thread* client = new client_thread();
	  client->Run(c_fd, cmd_sys, ip_client, &_timer);

	}
      catch (std::bad_alloc& ba)
	{
	  std::cerr << "bad_alloc caught: " << ba.what() << '\n';
	}
      std::cout << "LISTENER::Endloop"<< std::endl;
    }
}
