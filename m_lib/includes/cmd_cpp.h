#ifndef CMD_CPP
#define CMD_CPP

#include <Acmd.h>
#include <vector>
#include <string>

class	cmd_s
{
public:
  cmd_s();
  ~cmd_s();

  void	Init(const int, const int);
  bool	run(const std::string);
  std::string	get_ret();

private:
  std::vector<Acmd*>	_mod_cmd;
  int			_fd;
  std::string		_ret;
};

#endif
