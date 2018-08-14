#ifndef SERVERREC
#define SERVERREC

#include "Aserver.h"
#include <reseau.h>
#include "usr_capture.h"
#include <vector>
#include	<thread>
#include <cmd_cpp.h>

class	Serverrec : public Aserver
{
public:
  Serverrec();
  virtual ~Serverrec();

 private:
  //Var thread
  virtual void	Servlet(int, cmd_s*);
  virtual void	Listener();

};
#endif
