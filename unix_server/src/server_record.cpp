#include "server_record.h"
#include "cmd_cpp.h"
#include <iostream>
#include <new>

Serverrec::Serverrec()
{}
Serverrec::~Serverrec()
{}
//	--- Thread exec -- //

void	Serverrec::Servlet(int c_fd, cmd_s* cmd_s)
{
  bool	exit = true;
  std::string closeSocket = "-==SERVERCLOSESOCKET==-";
  //_connection.Send("HELLO\n", c_fd);

  while (exit)
    {

      std::string	buf_in = "";
      std::string	buf_out= "";
      
      buf_in = _connection.Recv(c_fd);
      std::string ip = _connection.Get_ip();
      if (!_connection.Islocal(ip))
        std::cout << "Request[" << ip << "][" << (void*)this << "]" << std::endl;
        //std::cout << "DATA[" << buf_in << "]" << std::endl;

      if (buf_in.compare("ERR\n") == 0){
        //Stop thread
        exit = false;
      }
      else {
        //No err Tech
        _rec.Push("Recv :", buf_in, _connection.Get_ip(), _connection.getPort());
        if (buf_in.back() == '\n'){
          size_t	size;
          size = buf_in.size();
          buf_in.erase(size-1, size);
        }
        if (buf_in.compare("monitor_c") == 0)
          buf_out = "WELCOME\n";
        else{
          buf_out = "BIP\r\n";
          if(cmd_s->run(buf_in)){
            buf_out = cmd_s->get_ret();
          }
          if (buf_out.compare("EXIT") == 0)
            {
              exit = false;
              buf_out = "EXIT_FORCE\n";
            }
          //Close after httpResponse
          else if (buf_out.compare(0, closeSocket.size(), closeSocket) == 0){
            //std::cout << "ERASE[" << buf_out.substr(closeSocket.size()) << "]"<< std::endl;
            //Force Send & Close client
            buf_out = buf_out.substr(closeSocket.size());
            _connection.Send(buf_out, c_fd);
            _rec.Push("Send :", buf_out, _connection.Get_ip(), _connection.getPort());
            //close(c_fd);
            exit = false;
          }
        }
        if (exit){
          _connection.Send(buf_out, c_fd);
          _rec.Push("Send :", buf_out, _connection.Get_ip(), _connection.getPort());
        }
      }  
      buf_out.clear();
      buf_in.clear();
    }
  if (!_connection.Islocal(_connection.Get_ip()))
    std::cout << "Close servelet on :" << c_fd << std::endl;
  close(c_fd);
}

void	Serverrec::Listener()
{

  while (_exit)
    {
      std::string	ip_client;
      int		c_fd;

      c_fd = _connection.Accept();
      ip_client = _connection.Get_ip();
      if (!_connection.Islocal(ip_client))
	      _rec.New_client(ip_client, std::to_string(_connection.getPort()));
      try
	{
	  cmd_s* cmd_sys = new cmd_s();
	  cmd_sys->Init(c_fd, _connection.getPort());
	  _list_thread.push_back(std::thread(std::bind(&Serverrec::Servlet, this, c_fd, cmd_sys)));
	}
      catch (std::bad_alloc& ba)
	{
	  std::cerr << "bad_alloc caught: " << ba.what() << '\n';
	}
    }
}
