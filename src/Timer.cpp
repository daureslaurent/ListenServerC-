#include "Timer.h"



Timer::Timer()
{
}


Timer::~Timer()
{
}

void Timer::Start()
{
  _time_start = clock();
  timeElapsed = 0;
}

void Timer::Stop()
{
  _time_end = clock() - _time_start;
  timeElapsed = (double)(_time_end/(double)CLOCKS_PER_SEC);
}

int Timer::elapsed()
{
  return timeElapsed;
}

double Timer::elapsed_live()
{
  clock_t timetmp;

  timetmp = clock() - _time_start;
  return ((double)timetmp/(double)CLOCKS_PER_SEC);
}
