#ifndef	SSH_CMD
#define	SSH_CMD
#include <Acmd.h>
#include <sstream>

class	CMD_http : public Acmd
{
public:
  CMD_http();
  virtual		~CMD_http();
  virtual void		Init(const int);
  virtual std::string	Run();
private:
  int	void_test;
};

#endif
