#ifndef USR_CAPTURE
#define USR_CAPTURE

#include <string>
#include <fstream>
#include <reseau.h>

class	Serv_Capture
{
private:
  void	get_time(std::ofstream);
  
  Ireseau_client	_connection;

public:
  Serv_Capture();
  ~Serv_Capture();

  void	Init();

  void	Update();

  void	Push(std::string, std::string);

  void	Push(std::string, std::string, std::string, int);

  void	New_client(std::string, int);
};
#endif
