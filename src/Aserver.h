#ifndef A_SERVER
#define A_SERVER

#include <reseau.h>
#include <functional>
#include "usr_capture.h"
#include <vector>
#include <string>
#include	<thread>
#include "cmd_cpp.h"
#include "client.h"
#include "Timer.h"

class	Aserver
{
public:
  Aserver();
  virtual ~Aserver();

  bool	Run(const int, const std::string);
  void	Wait_end();

protected:
  bool	Init(const int);
  //Var thread
  std::vector<std::thread>	_list_thread;
  std::thread	_thread;
  std::thread	_listener;
  std::string	_version;
  bool		_exit;

  virtual void	Servlet(int, cmd_s*);
  virtual void	Listener();

  //Modules
  Ireseau	_connection;
  Serv_Capture	_rec;
  Timer		_timer;
};
#endif
