#include <iostream>
#include "server.h"
#include "server_record.h"
#include "Aserver.h"
#include <cstdlib>
#include "version.h"

void	disp_help()
{
  std::cout << "\t./ serv [PORT]" << std::endl;
}

int	main(int ac, char **av)
{
  int		port;

  //std::cout << "Serv " << VERSION << std::endl;

  if (ac == 2)
    {
      Aserver	*server_ctrl = new Server();
      port = atoi(av[1]);
      std::cout << "ListenServ safe:" << port << std::endl;
      server_ctrl->Run(port, std::string(VERSION));
      server_ctrl->Wait_end();
    }
  if (ac == 3)
    {
      Aserver	*server_ctrl = new Serverrec();
      port = atoi(av[1]);
      //std::cout << "ListenServ record:" << port << std::endl;
      server_ctrl->Run(atoi(av[1]), std::string(VERSION));
      server_ctrl->Wait_end();
    }
  else
    disp_help();
  std::cout << "Finish Prog" << std::endl;
  return 0;
}
