#ifndef	PING_CMD
#define	PING_CMD
#include <Acmd.h>

class	CMD_ping : public Acmd
{
public:
  CMD_ping();
  virtual		~CMD_ping();
  virtual void		Init(const int);
  virtual std::string	Run();
private:
  int	void_test;
};

#endif
