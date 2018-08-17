#include "versionCmd.h"
#include <string>
#include <fstream>
#include <iostream>
#include <version.h>

CMD_version::CMD_version()
{
  _parse = "VERSION";
}

CMD_version::~CMD_version()
{}

void		CMD_version::Init(const int fd)
{
  _fd = fd;
}

std::string	CMD_version::Run()
{
  return "-==SERVERCLOSESOCKET==-\n" + std::atoi(VERSION);
}