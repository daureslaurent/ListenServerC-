#ifndef	VERSION_CMD
#define	VERSION_CMD
#include <Acmd.h>

class	CMD_version : public Acmd
{
public:
  CMD_version();
  virtual		~CMD_version();
  virtual void		Init(const int);
  virtual std::string	Run();
private:
  int	void_test;
  int _port;
};

#endif
