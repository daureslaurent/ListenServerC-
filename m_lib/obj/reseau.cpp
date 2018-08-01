#include <iostream>
#include <cstring>
#include <cerrno>
#include <string>

#include <netinet/in.h>
#include <arpa/inet.h>
#include <reseau.h>

Ireseau::Ireseau()
{}
Ireseau::~Ireseau()
{}

bool	Ireseau::Init(const int port)
{
  std::cout << "Init connection reseau" << std::endl;
  _fd_serv = init_socket(port);
  if (_fd_serv == -1)
    return false;
  std::cout << "Serveur[" << _fd_serv << "]" << std::endl;
  return true;
}

void	Ireseau::Err(const std::string msg)
{
  char buffer[ 256 ];
  char *errorMessage = strerror_r( errno, buffer, 256 );
  std::cout << msg << ":" << errorMessage << std::endl;
}

int	Ireseau::init_socket(const int port)
{
  int			server_len;
  int			server_sockfd;
  struct sockaddr_in	server_address;

  std::cout << "Init socket	" << std::endl;
  memset(&server_address, '\0', sizeof(server_address));

  if ( (server_sockfd = socket(AF_INET, SOCK_STREAM, 0)) == -1)
    {
      Err("\033[1;31m[FAIL]\033[0m");
      return (-1);
    }
  std::cout << "\033[1;32m[OK]\033[0m\nBind socket	" << std::endl;
  server_address.sin_family = AF_INET;
  server_address.sin_addr.s_addr = htonl(INADDR_ANY);
  server_address.sin_port = htons(port);
  server_len = sizeof(server_address);
  if (bind(server_sockfd, (struct sockaddr *)&server_address,server_len) == -1)
    {
      Err("\033[1;31m[FAIL]\033[0m");
      return (-1);
    }
  std::cout << "\033[1;32m[OK]\033[0m\n" << std::endl;
  listen(server_sockfd, 5);
  return (server_sockfd);
}

int	Ireseau::Accept()
{
  struct sockaddr	c_addr;
  socklen_t		c_len = sizeof(c_addr);
  int			client_fd;

  c_len = sizeof(c_addr);
  client_fd = accept(_fd_serv, (struct sockaddr *)&_addr_tmp, &c_len);
  if (client_fd == -1)
    {
      Err("accept client");
      return -1;
    }
  return client_fd;
}

std::string	Ireseau::Recv(int fd)
{
  char	buf[2048];
  int	ret;

  ret = recv(fd, &buf, 2048, 0);
  if (ret == 0)
    {
      std::cout << "[Recv]fd["<<fd<<"]ret["<<ret<<"]" << std::endl;
    return ("EXIT\n");
    }
  else if (ret == -1)
    {
      std::cout << "[Recv]fd["<<fd<<"]ret["<<ret<<"]" << std::endl;
      return "ERR\n"; // ERR
    }
  else if (ret != -1){
    //OK MSG
    buf[ret] = 0;
    std::cout << "[Recv]fd["<<fd<<"]ret["<<ret<<"]msg\n"<<(char*)&buf<< std::endl;
    return (std::string((char*)&buf));
  }
}

void		Ireseau::Send(const std::string msg, const int fd)
{
  char		buf[2048];
  std::cout << "[Send]fd["<<fd<<"]msg:\n"<<(char*)&buf << std::endl;
  memset(&buf, 0, 2048);
  strcpy((char*)&buf, msg.c_str());
  if (write(fd, &buf, msg.size()) == -1)
    std::cout << "erreur send" << std::endl;
}

std::string	Ireseau::Get_ip()
{
  struct sockaddr_in*	pV4Addr = (struct sockaddr_in*)&_addr_tmp;
  int			ipAddr = pV4Addr->sin_addr.s_addr;
  char			str[INET_ADDRSTRLEN];

  inet_ntop( AF_INET, &ipAddr, str, INET_ADDRSTRLEN );
  return (std::string((char*)&str));
}

bool		Ireseau::Islocal(std::string ip)
{
  std::string	pars_local0("192.168.");
  std::string	pars_local1("127.0.0.1");

  if (ip.compare(0, pars_local0.size(), pars_local0) == 0)
    return true;
  else if (ip.compare(0, pars_local1.size(), pars_local1) == 0)
    return true;
  else
    return false;
}


// RESEAU POUR CLIENT
Ireseau_client::Ireseau_client()
{}
Ireseau_client::~Ireseau_client()
{}

void	Ireseau_client::Err(const std::string msg)
{
  char buffer[ 256 ];
  char *errorMessage = strerror_r( errno, buffer, 256 );
  std::cout << msg << ":" << errorMessage << std::endl;
}

bool	Ireseau_client::Init(const std::string addr, const int port)
{
  int			tgt_len;
  int			tgt_sockfd;
  struct sockaddr_in	tgt_address;

  std::cout << "Init socket	" << std::endl;
  memset(&tgt_address, '\0', sizeof(tgt_address));

  if ( (tgt_sockfd = socket(AF_INET, SOCK_STREAM, 0)) == -1)
    {
      Err("\033[1;31m[FAIL]\033[0m");
      return (false);
    }
  std::cout << "\033[1;32m[OK]\033[0m\nConnect	" << std::endl;
  tgt_address.sin_family = AF_INET;
  tgt_address.sin_port = htons(port);
  tgt_address.sin_addr.s_addr = inet_addr(addr.c_str());
  tgt_len = sizeof(tgt_address);

  if (connect(tgt_sockfd, (const struct sockaddr *)&tgt_address, tgt_len) == -1)
    {
      Err("\033[1;31m[FAIL]\033[0m");
      return (false);
    }
  std::cout << "\033[1;32m[OK]\033[0m\n" << std::endl;
  _fd = tgt_sockfd;
  return (true);
}

int	Ireseau_client::get_fd()
{
  return _fd;
}

std::string	Ireseau_client::Recv()
{
  char	buf[512];
  int	ret;

  ret = recv(_fd, &buf, 512, 0);
  if (ret == 0)
    return ("EXIT\n");
  else if (ret != -1)
    buf[ret] = 0;
  return (std::string((char*)&buf));
}

void		Ireseau_client::Send(const std::string msg)
{
  char		buf[512];

  memset(&buf, 0, 512);
  strcpy((char*)&buf, msg.c_str());
  send(_fd, &buf, 512, 0);
}
