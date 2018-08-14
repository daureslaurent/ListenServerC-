#ifndef	SSH_CMD
#define	SSH_CMD
#include <Acmd.h>

class	CMD_ssh : public Acmd
{
public:
  CMD_ssh();
  virtual		~CMD_ssh();
  virtual void		Init(const int);
  virtual std::string	Run();
private:
  int	void_test;
};

#endif
