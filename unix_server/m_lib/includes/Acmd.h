#ifndef ABSTRACT_CMD
#define ABSTRACT_CMD

#include <string>

class	Acmd
{
public:
  Acmd();
  virtual		~Acmd();

  virtual void		Init(const int);
  virtual std::string	Run();
  virtual std::string	get_parse();
  void			set_cmd(const std::string);

protected:
  std::string	_parse;
  std::string	_cmd;
  int		_fd;
};

#endif
