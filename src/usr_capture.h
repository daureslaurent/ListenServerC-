#ifndef USR_CAPTURE
#define USR_CAPTURE

#include <string>
#include <fstream>

class	Serv_Capture
{
private:
  void	get_time(std::ofstream);
public:
  Serv_Capture();
  ~Serv_Capture();

  void	Init();

  void	Update();

  void	Push(std::string, std::string);

  void	Push(std::string, std::string, std::string);

  void	New_client(std::string);
  
  std::string b64decode(const void* data, const size_t len);
};
#endif
