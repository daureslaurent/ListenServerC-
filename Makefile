NAME	=	serv

DIR	=	src/

MLIB	=	m_lib/obj/

SRCS	=	$(DIR)main.cpp \
		$(DIR)base64.cpp \
		$(DIR)usr_capture.cpp \
		$(DIR)Aserver.cpp \
		$(DIR)server.cpp \
		$(DIR)server_record.cpp \
		$(MLIB)reseau.cpp \
		$(MLIB)cmd/Acmd.cpp \
		$(MLIB)cmd/cmd_cpp.cpp \
		$(MLIB)cmd/ping.cpp \
		$(MLIB)cmd/log.cpp \
		$(DIR)user.cpp \
		$(DIR)client.cpp \
		$(DIR)Timer.cpp


DIR_m	=	src_monitor/

SRCS_m	=	$(DIR_m)main.cpp \
		$(MLIB)reseau.cpp \
		$(DIR_m)monitor.cpp

OBJS	=	$(SRCS:.cpp=.o)

OBJS_m	=	$(SRCS_m:.cpp=.o)

CC	=	g++

FLAGS	=	-std=c++0x -pthread -Im_lib/includes/ -W -Wall -O3

RM	=	rm -f

all:	serveur monitor

serveur	:
	$(CC) $(SRCS) $(FLAGS) -o serv
	@echo "\033[1;32m[G++][EXC] creation de -> $@\033[00m"

monitor: monitorfclean
	$(CC) $(SRCS_m) $(FLAGS) -o monitor 
	@echo "\033[1;32m[G++][EXC] creation de -> $@\033[00m"

monitorfclean:
	@$(RM) $(OBJS_m)
	@echo "\033[1;36m[RM][OBJ] $@\033[00m"

	@$(RM) monitor_bin
	@echo "\033[1;33m[RM][EXC] $@\033[00m"

clean:
	@$(RM) $(OBJS)
	@echo "\033[1;36m[RM][OBJ] $@\033[00m"


fclean: clean
	@$(RM) $(NAME)
	@echo "\033[1;33m[RM][EXC] $@\033[00m"

re: fclean monitorfclean all
