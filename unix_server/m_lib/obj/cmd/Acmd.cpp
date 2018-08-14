#include <Acmd.h>

Acmd::Acmd()
{}
Acmd::~Acmd()
{}

void		Acmd::Init(const int)
{}

std::string	Acmd::Run()
{
  return "CMD_EMPTY";
}

void		Acmd::set_cmd(const std::string cmd)
{
  _cmd = cmd;
}

std::string	Acmd::get_parse()
{
  return _parse;
}
