#ifndef CTRL_SERVER
#define CTRL_SERVER

#include <vector>
#include <string>

class	Ctrl_serv
{
public:
  Ctrl_serv();
  ~Ctrl_serv();

  bool	add_monitor();
  void	stop_serv(std::string);
  std::string	get_info(std::string);
  std::string	get_info();
private:
  std::vector<*Aserver>	_list_serv;
};

#endif
