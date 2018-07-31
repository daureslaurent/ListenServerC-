#include "client.h"

client_thread::client_thread()
{}

client_thread::~client_thread()
{}

void		client_thread::Run(int c_fd, cmd_s* cmd_sys, std::string ip, Timer* timer)
{
  _thread = new std::thread(std::bind(&client_thread::Servlet, this, cmd_sys));
  _ip = ip;
  _fd = c_fd;
  _timer = timer;
}

void		client_thread::Join()
{
  _thread->join();
}

std::string	client_thread::recv_client()
{
  std::string	out;

  out = _connection.Recv(_fd);
  std::cout << "recv[" << out << "]" << std::endl;
  if (out.back() == '\n')
    {
      size_t	size;
      size = out.size();
      out.erase(size-1, size);
    }
  return out;
}

void		client_thread::Servlet(cmd_s* cmd_s)
{
  bool	exit = true;
  std::string	buf_in;
  std::string	buf_out;

    _connection.Send("HELLO\n", _fd);
    std::cout << "Client ->"<< _ip << "<- : " << _fd << std::endl;

  while (exit)
    {
      buf_in = recv_client();
      if (buf_in.compare("EXIT") == 0)
	{
	  exit = false;
	  std::cout << "Client::EXIT_IN" << std::endl;
	  _connection.Send("EXIT_OK\n", _fd);
	  break;
	}
      else if (cmd_test(buf_in, buf_out));
      else
	{
	  buf_out = "NOTHING\n";
	  if(cmd_s->run(buf_in))
	    buf_out = cmd_s->get_ret();
	  if (buf_out.compare("EXIT") == 0 || buf_out.compare("err") == 0)
	    {
	      std::cout << "Client::EXIT_OUT" << std::endl;
	      exit = false;
	      buf_out = "EXIT_FORCE\n";
	      break;
	    }
	}
      std::cout << "send[" << buf_out << "]:"<< _ip << std::endl;
      _connection.Send(buf_out, _fd);
      buf_out.clear();
      buf_in.clear();
    }
  std::cout << "Close servelet on :" << _fd << std::endl;
  close(_fd);
}


bool	client_thread::cmd_test(std::string buf_in, std::string &buf_out)
{
  if (buf_in.compare("VERSION") == 0)
    {
      buf_out = VERSION;
      buf_out += "\n";
      return true;
    }
  else if (buf_in.compare("TIME") == 0)
    {
      std::cout << "time : " << _timer->elapsed_live() << std::endl;
      buf_out = std::to_string(_timer->elapsed_live() *10000);
      buf_out += "\n";
      return true;
    }
  else if (buf_in.compare(0, 5, "LOGIN") == 0)
    {

      buf_in.erase(0, 6);
      size_t		posdp = buf_in.find(":");

      std::string user= buf_in.substr(0,posdp);
      std::string pass = buf_in.substr(posdp+1);

      std::cout << "Login : " << "[" << user << "]:[" << pass << "]" << std::endl;
      buf_out = "FAIL";
      if (user.compare("Lolo") == 0)
	if (pass.compare("PASS") == 0)
	  buf_out = "OK";
      buf_out += "\n";
      return true;
    }
  return false;
}
