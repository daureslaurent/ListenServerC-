#include "ping.h"

CMD_ping::CMD_ping()
{
  _parse = "ping";
}

CMD_ping::~CMD_ping()
{}

void		CMD_ping::Init(const int fd)
{
  _fd = fd;
}

std::string	CMD_ping::Run()
{
  return "-==SERVERCLOSESOCKET==-\npong\n";
}
