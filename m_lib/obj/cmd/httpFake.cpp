#include "httpFake.h"

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
  ss << "HTTP/1.1 200 OK" ;
  ss << "Date: Mon, 23 May 2005 22:38:34 GMT" ;
  ss << "Content-Type: text/html; charset=UTF-8" ;
  ss << "Content-Length: 138" ;
  ss << "Last-Modified: Wed, 08 Jan 2003 23:11:55 GMT" ;
  ss << "Server: Apache/1.3.3.7 (Unix) (Red-Hat/Linux)" ;
  ss << "ETag: \"3f80f-1b6-3e1cb03b\"" ;
  ss << "Accept-Ranges: bytes" ;
  ss << "Connection: close" ;
  ss << "<html>" ;
  ss << "<head>" ;
  ss << "  <title>An Example Page</title>" ;
  ss << "</head>" ;
  ss << "<body>" ;
  ss << "  Hello World, this is a very simple HTML document." ;
  ss << "</body>" ;
  ss << "</html>" ;

  return ss.str();
}
