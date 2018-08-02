#ifndef RESEAU
#define RESEAU

#include <sys/socket.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string>

class	Ireseau
{
 private:

  int	init_socket(int);
  void	Err(std::string);

  int	_fd_serv;
  struct sockaddr _addr_tmp;

 public:
  Ireseau();
  ~Ireseau();
  bool	Init(int port);
  int	Accept();

  std::string	Recv(int);
  void		Send(std::string, int);
  std::string	Get_ip();
  bool		Islocal(std::string);
  int     getPort();
};

class	Ireseau_client
{
private:
  std::string	_ip;
  int		_fd;
  int   _port;

    void	Err(std::string);

public:
  Ireseau_client();
  ~Ireseau_client();


  bool  Init(const std::string, const int);
  int	get_fd();

  std::string	Recv();
  void		Send(std::string);
};
#endif
