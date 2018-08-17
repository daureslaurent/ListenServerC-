#include "log.h"
#include <string>
#include <fstream>
#include <iostream>

CMD_log::CMD_log(const int port)
{
  _port = port;
  _parse = "log";
}

CMD_log::~CMD_log()
{}

void		CMD_log::Init(const int fd)
{
  _fd = fd;
}

std::string	CMD_log::Run()
{
  int maxLine = 10;
  std::string path = "out"+std::to_string(_port)+"/log_connection.log";
  std::ifstream		fichier(path, std::ios::in);  // on ouvre en lecture
  std::string		final = "-==SERVERCLOSESOCKET==-";

  if (fichier)  // si l'ouverture a fonctionné
    {
      int index = 0;
      while (fichier.good())
      {
        std::string	buf;  // déclaration d'une chaîne qui contiendra la ligne lue
        std::getline(fichier, buf);  // on met dans "contenu" la ligne
        if (index < maxLine){
          final += buf;
          final += "\n";
        }
      }
      fichier.close();
    }
  else
    {
      std::cerr << "Impossible d'ouvrir le fichier !" << std::endl;
      final = "-==SERVERCLOSESOCKET==-Erre open file (SERVER)(NOTFIND)";
    }
  return final;
}

/*                                            */


CMD_logd::CMD_logd()
{
  _parse = "Dlog";
}

CMD_logd::~CMD_logd()
{}

void		CMD_logd::Init(const int fd)
{
  _fd = fd;
}

std::string	CMD_logd::Run()
{
  std::string		final;
  std::string		path;
  std::ifstream		fichier;

  _cmd.erase(0, _parse.size());
  if (_cmd[0] == ' ')
    _cmd.erase(0, 1);
  path = _cmd;
  path.insert(0, "out/");
  path.append(".log");
  fichier.open(path, std::ios::in);

  if (fichier)  // si l'ouverture a fonctionné
    {
      while (fichier.good())
	{
	  std::string	buf;  // déclaration d'une chaîne qui contiendra la ligne lue
	  std::getline(fichier, buf);  // on met dans "contenu" la ligne
	  final += buf;
	  final += "\n";
	}
      fichier.close();
    }
  else
    {
      std::cerr << "Impossible d'ouvrir le fichier !" << std::endl;
      final = "Erre open file (SERVER)(NOTFIND)";
    }
  return final;
}
