#ifndef USER
#define USER

#include <vector>
#include <string>

struct	user_i
{
std::string	_name;
std::string	_addr;
bool		_islocal;
};

class	User
{
public:
  User();
  ~User();

  void	add_user(std::string);
private:
  std::vector<user_i>	_data;
};

#endif
