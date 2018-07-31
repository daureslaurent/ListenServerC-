#ifndef THREAD_CONTROL
#define	THREAD_CONTROL

#include	<thread>
#include	<iostream>
#include	<vector>
#include	<string>
#include	<mutex>

#include	"thread/new_user.h"
#include	"thread/room_ctrl.h"
#include	"rtype_net.h"

class	Thread_ctrl
{
public:

  Thread_ctrl();
  ~Thread_ctrl();
  std::string	Get_etat();
  void		Init(int, int);
  void		Run();


  void		Run_NU(); // New User
  void		Run_RC(); // Room Control
  void		Run_CTRL(); // thread Control
  void		Exit();
  void		Join();
  void		disp();

private:

  Thread_nu	_inter_nu;
  std::thread	_thread_nu;
  Thread_rc	_inter_rc;
  std::thread	_thread_rc;

  //Thread var
  void		Do_CTRL();
  std::thread	_thread_ctrl;
  bool		_exit;

  int           _port_nu;
  int           _port_rc;

  
  std::string	_etat;
  std::mutex	m_stat;
  int		fd_server;

  Rtype_net	_net;
};

#endif
