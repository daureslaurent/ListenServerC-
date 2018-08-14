#ifndef SERVER
#define SERVER

#include "Aserver.h"
#include <reseau.h>
#include "usr_capture.h"
#include <vector>
#include	<thread>
#include <cmd_cpp.h>


class	Server : public Aserver
{
public:
  Server();
  virtual ~Server();

 private:
  //Var thread

  virtual void	Servlet(int, cmd_s*);
  virtual void	Listener();


};
#endif
