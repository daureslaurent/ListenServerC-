#include "usr_capture.h"
#include "base64.h"
#include <iostream>
#include <fstream>

Serv_Capture::Serv_Capture()
{}
Serv_Capture::~Serv_Capture()
{}

void	Serv_Capture::Init()
{

}
void	Serv_Capture::Update()
{
}

void	Serv_Capture::New_client(std::string ip)
{
  std::ofstream fichier("out/log_connection.log", std::ofstream::out | std::ofstream::app);
  if(fichier)
    {
      time_t currentTime;
      struct tm *localTime;

      time( &currentTime );
      localTime = localtime( &currentTime );

      int Day    = localTime->tm_mday;
      int Month  = localTime->tm_mon + 1;
      int Hour   = localTime->tm_hour;
      int Min    = localTime->tm_min;
      int Sec    = localTime->tm_sec;

      fichier << Day << "/" << Month << " " << Hour << ":" << Min << ":" << Sec << " -> ";
      fichier << "[" << ip << "]" << std::endl;
      fichier.close();
    }
}

void	Serv_Capture::Push(std::string msg, std::string var, std::string ip)
{
  std::string	path("out/");

  path += ip;
  path += ".log";

  std::ofstream fichier(path, std::ofstream::out | std::ofstream::app);  // on ouvre en lecture

  if(fichier)
    {

      time_t currentTime;
      struct tm *localTime;

      time( &currentTime );
      localTime = localtime( &currentTime );

      int Day    = localTime->tm_mday;
      int Month  = localTime->tm_mon + 1;
      int Hour   = localTime->tm_hour;
      int Min    = localTime->tm_min;
      int Sec    = localTime->tm_sec;

      /*if (var.back() == '\n')
	{
	  size_t	size;

	  size = var.size();
	  var.erase(size-1, size);
	  }*/
      //Encrypt data
      std::string encoded = base64_encode(reinterpret_cast<const unsigned char*>(var.c_str()), var.length());
      //send over socket
      if (_connection.Init("127.0.0.1", 2120)){
        _connection.Send(encoded);
        std::cout << "\033[1;32mData send\033[0m" << std::endl;
        close(_connection.get_fd());
      }
      else {
        std::cout << "\033[1;31mErreur lors de l'envoi vers le server back \033[0m" << std::endl;
      }

      fichier << Day << "/" << Month << " - " << Hour << ":" << Min << ":" << Sec << ">:";
      fichier << msg << "[" << encoded << "]" << std::endl;
      fichier.close();
    }
}
void	Serv_Capture::Push(std::string msg, std::string var)
{
  std::ofstream fichier("out/old_log.log", std::ofstream::out | std::ofstream::app);  // on ouvre en lecture

  if(fichier)
    {

      time_t currentTime;
      struct tm *localTime;

      time( &currentTime );
      localTime = localtime( &currentTime );

      int Day    = localTime->tm_mday;
      int Month  = localTime->tm_mon + 1;
      int Hour   = localTime->tm_hour;
      int Min    = localTime->tm_min;
      int Sec    = localTime->tm_sec;

      if (var.back() == '\n')
      {
        size_t	size;

        size = var.size();
        var.erase(size-1, size);
      }
      fichier << Day << "/" << Month << " - " << Hour << ":" << Min << ":" << Sec << ">:";
      fichier << msg << "[" << var << "]" << std::endl;
      fichier.close();
    }
    else
      {
        std::cerr << "Impossible d'ouvrir le fichier !" << std::endl;
        std::cout << msg << var << std::endl;
      }
}