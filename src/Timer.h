#ifndef _TIMER_
#define _TIMER_

#include <ctime>
class Timer
{
public:
  Timer();
  ~Timer();
  void	Start();
  void	Stop();
  int	elapsed();
  double	elapsed_live();
private:
  double	timeElapsed;
  clock_t	_time_end;
  clock_t	_time_start;
};

#endif
