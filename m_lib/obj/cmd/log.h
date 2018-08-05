#ifndef	LOG_CMD
#define	LOG_CMD
#include <Acmd.h>

class	CMD_log : public Acmd
{
public:
  CMD_log(const int);
  virtual		~CMD_log();
  virtual void		Init(const int);
  virtual std::string	Run();
private:
  int	void_test;
  int _port;
};

class	CMD_logd : public Acmd
{
public:
  CMD_logd();
  virtual		~CMD_logd();
  virtual void		Init(const int);
  virtual std::string	Run();
private:
  int	void_test;
};

#endif
