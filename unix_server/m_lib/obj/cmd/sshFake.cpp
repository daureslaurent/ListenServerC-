#include "sshFake.h"

CMD_ssh::CMD_ssh()
{
  _parse = "SSH-2.0-PUTTY";
}

CMD_ssh::~CMD_ssh()
{}

void		CMD_ssh::Init(const int fd)
{
  _fd = fd;
}

std::string	CMD_ssh::Run()
{
  return "-==SERVERCLOSESOCKET==-\nBANNED\r\n\r\n";

  return "OKRETURNSSH";
}
