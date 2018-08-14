#include "httpFake.h"
#include <iostream>

CMD_http::CMD_http()
{
  _parse = "GET";
}

CMD_http::~CMD_http()
{}

void		CMD_http::Init(const int fd)
{
  _fd = fd;
}

std::string	CMD_http::Run()
{
  std::stringstream ss;
  ss << "-==SERVERCLOSESOCKET==-" <<std::endl;
  ss << "HTTP/1.1 200 OK" <<std::endl;
  ss << "Date: Mon, 23 May 2005 22:38:34 GMT"<<std::endl;
  ss << "Content-Type: text/html; charset=UTF-8"<<std::endl;
  ss << "Content-Length: 138"<<std::endl;
  ss << "Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT"<<std::endl;
  ss << "Server: Apache/1.3.3.7 (Unix) (Red-Hat/Linux)"<<std::endl;
  ss << "ETag: \"3f80f-1b6-3e1cb03b\""<<std::endl;
  ss << "Accept-Ranges: bytes"<<std::endl;
  ss << "Connection: close"<<std::endl<<std::endl;
  ss << "<html>"<<std::endl;
  ss << "<head>"<<std::endl;
  ss << "  <title>An Example Page</title>"<<std::endl;
  ss << "</head>"<<std::endl;
  ss << "<body>"<<std::endl;
  ss << "  Hello World, this is a very simple HTML document."<<std::endl;
  ss << "</body>"<<std::endl;
  ss << "</html>"<<std::endl;
  //std::cout << ss.str() << std::endl;
  return ss.str();
}
