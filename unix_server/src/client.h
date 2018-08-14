#pragma once

#include <thread>
#include <vector>
#include <string>
#include <iostream>
#include <new>
#include <reseau.h>

#include "cmd_cpp.h"
#include "version.h"
#include "Timer.h"

class	client_thread
{
public:
  client_thread();

  ~client_thread();

  void	Run(int c_fd, cmd_s* cmd_sys, std::string ip, Timer*);

  void	Join();

  void	Servlet(cmd_s* cmd_s);

private:
  std::string	recv_client();

  bool	cmd_test(std::string, std::string&);

  std::thread*	_thread;
  Ireseau	_connection;
  int		_fd;
  std::string	_ip;
  Timer*	_timer;
};
