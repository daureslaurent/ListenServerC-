#include	"thread_ctrl.h"

Thread_ctrl::Thread_ctrl()
{}

Thread_ctrl::~Thread_ctrl()
{}

void		Thread_ctrl::Run_NU()
{
    _inter_nu.Init(_port_nu, _port_rc);
  _thread_nu = std::thread(std::bind(&Thread_nu::New_user, &_inter_nu, fd_server));
}

void		Thread_ctrl::Run_RC()
{
  _inter_rc.Init(_port_rc, fd_server);
  _thread_rc = std::thread(std::bind(&Thread_rc::Run, &_inter_rc));
}


/* -------------------------------------------------------------- */

void		Thread_ctrl::Run_CTRL()
{
  _thread_ctrl = std::thread(std::bind(&Thread_ctrl::Do_CTRL, this));
}

void		Thread_ctrl::Do_CTRL() //Interface entre thread
{

  while (!(_exit))
    {
      if (_inter_nu.get_user_state())
	std::cout << "Newuser : " << _inter_nu.Get_ip() << std::endl;
      usleep(500);
    }
}

/* ------------------------------------------------------------ */

std::string	Thread_ctrl::Get_etat()
{
  return _etat;
}

void		Thread_ctrl::Init(int port_nu, int port_rc)
{
  if (!_net.Setup("127.0.0.1", port_nu))
    std::cout << "Erreur init connexion Thread_ctrl::Init" << std::endl;

  _port_nu = port_nu;
  _port_rc = port_rc;

  if ((fd_server = socket(AF_INET, SOCK_DGRAM, 0)) == -1)
    std::cout << "err init socket Thread_ctrl::Init" << std::endl;
  m_stat.lock();
  _etat = "INIT";
  m_stat.unlock();
  _exit = false;
}

void		Thread_ctrl::Join()
{
  if (_thread_nu.joinable())
    _thread_nu.join();
  if (_thread_rc.joinable())
    _thread_rc.join();
  if (_thread_ctrl.joinable())
    _thread_ctrl.join();
  //_thread_rc.join();
}

void		Thread_ctrl::disp()
{
  _inter_nu.Display_etat();
  _inter_rc.Display_etat();
}

void		Thread_ctrl::Exit()
{
  _exit = true;
  _inter_rc.Exit();
  _net.Send("EXIT_THREAD");
  _net.Change_ip("127.0.0.1", _port_rc);
  _net.Send("EXIT_THREAD");
}
