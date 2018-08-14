#include "Aserver.h"
#include "cmd_cpp.h"
#include <iostream>
#include <new>

Aserver::Aserver()
{}
Aserver::~Aserver()
{}
bool	Aserver::Run(const int port, const std::string version)
{
  if (!(_exit = Init(port)))
    return false;
  _version = version;
  _timer.Start();
  _listener = std::thread(std::bind(&Aserver::Listener, this));
  return true;
}

void	Aserver::Wait_end()
{
  _listener.join();
}

bool	Aserver::Init(const int port)
{
  if (!_connection.Init(port))
    return false;
  return true;
}
void	Aserver::Servlet(int c_fd, cmd_s* cmd_s)
{
  (void)(c_fd);
  (void)(cmd_s);
}
void	Aserver::Listener()
{}
