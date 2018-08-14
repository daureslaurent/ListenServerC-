#ifndef SERVER
#define SERVER

#include <reseau.h>
#include "usr_capture.h"
#include <vector>
#include	<thread>
#include "cmd_cpp.h"
class	Server : public Aserver
{
public:
  Server();
  ~Server();
  bool	Run(const int);
  void	Wait_end();

 private:
  bool	Init(const int);
  //Var thread
  std::vector<std::thread>	_list_thread;
  std::thread	_thread;
  std::thread	_listener;
  bool		_exit;

  void	Servlet(int, cmd_s*);
  void	Listener();

  //Modules
  Ireseau	_connection;
  Serv_Capture	_rec;
};
#endif
