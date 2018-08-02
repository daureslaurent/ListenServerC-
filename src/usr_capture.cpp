#include "usr_capture.h"
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
      std::string msgEncoded = b64decode((const void*)var.c_str(), msg.length());
      fichier << Day << "/" << Month << " - " << Hour << ":" << Min << ":" << Sec << ">:";
      fichier << msg << "[" << msgEncoded << "]" << std::endl;
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

      //Need encrypt in Base64

      //Send throught socket

    /*fichier << Day << "/" << Month << " - " << Hour << ":" << Min << ":" << Sec << ">:";
      fichier << msg << "[" << var << "]" << std::endl;
      fichier.close();*/
    }
    else
      {
        std::cerr << "Impossible d'ouvrir le fichier !" << std::endl;
        std::cout << msg << var << std::endl;
      }
}


static const int B64index[256] = { 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 62, 63, 62, 62, 63, 52, 53, 54, 55,
56, 57, 58, 59, 60, 61,  0,  0,  0,  0,  0,  0,  0,  0,  1,  2,  3,  4,  5,  6,
7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,  0,
0,  0,  0, 63,  0, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51 };

std::string b64decode(const void* data, const size_t len)
{
    unsigned char* p = (unsigned char*)data;
    int pad = len > 0 && (len % 4 || p[len - 1] == '=');
    const size_t L = ((len + 3) / 4 - pad) * 4;
    std::string str(L / 4 * 3 + pad, '\0');

    for (size_t i = 0, j = 0; i < L; i += 4)
    {
        int n = B64index[p[i]] << 18 | B64index[p[i + 1]] << 12 | B64index[p[i + 2]] << 6 | B64index[p[i + 3]];
        str[j++] = n >> 16;
        str[j++] = n >> 8 & 0xFF;
        str[j++] = n & 0xFF;
    }
    if (pad)
    {
        int n = B64index[p[L]] << 18 | B64index[p[L + 1]] << 12;
        str[str.size() - 1] = n >> 16;

        if (len > L + 2 && p[L + 2] != '=')
        {
            n |= B64index[p[L + 2]] << 6;
            str.push_back(n >> 8 & 0xFF);
        }
    }
    return str;
}
