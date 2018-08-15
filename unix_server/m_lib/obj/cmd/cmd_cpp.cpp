#include <cmd_cpp.h>
//cmd
#include "ping.h"
#include "log.h"
#include "sshFake.h"
#include "httpFake.h"
//dev
#include <iostream>
cmd_s::cmd_s()
{}
cmd_s::~cmd_s()
{}

void	cmd_s::Init(const int fd, const int port)
{
  Acmd	*cmd_ping =	new CMD_ping();
  _mod_cmd.push_back(cmd_ping);
  Acmd	*cmd_log =	new CMD_log(port);
  _mod_cmd.push_back(cmd_log);
  Acmd	*cmd_dlog =	new CMD_logd();
  _mod_cmd.push_back(cmd_dlog);
  Acmd	*cmd_ssh =	new CMD_ssh();
  _mod_cmd.push_back(cmd_ssh);
  Acmd	*cmd_http_fake =	new CMD_http();
  _mod_cmd.push_back(cmd_http_fake);

  _fd = fd;
  //std::cout << "Commande Init - nb[" << (void*)this << "]" << std::endl;
}

bool	cmd_s::run(const std::string cmd)
{
        //else if (_mod_cmd[i]->get_parse().compare(cmd) == 0)

  _ret.clear();
  for (size_t i = 0; i < _mod_cmd.size(); i++)
    {
      size_t	size_pars = _mod_cmd[i]->get_parse().size();

      if (cmd.compare("EXIT") == 0)
	{
	  _ret = "EXIT";
	  return true;
	}
      else if (cmd.compare(0, size_pars, _mod_cmd[i]->get_parse()) == 0)
	{
	  _mod_cmd[i]->Init(_fd);
	  _mod_cmd[i]->set_cmd(cmd);
	  _ret = _mod_cmd[i]->Run();

	  return true;
	}
    }
  return false;
}
std::string	cmd_s::get_ret()
{
  return _ret;
}
