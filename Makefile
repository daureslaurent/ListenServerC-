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
		$(MLIB)cmd/sshFake.cpp \
		$(DIR)user.cpp \
		$(DIR)client.cpp \
		$(DIR)Timer.cpp

SRCS_OBJ=$(DIR)main.o \
		$(DIR)base64.o \
		$(DIR)usr_capture.o \
		$(DIR)Aserver.o \
		$(DIR)server.o \
		$(DIR)server_record.o \
		$(MLIB)reseau.o \
		$(MLIB)cmd/Acmd.o \
		$(MLIB)cmd/cmd_cpp.o \
		$(MLIB)cmd/ping.o \
		$(MLIB)cmd/log.o \
		$(DIR)user.o \
		$(DIR)client.o \
		$(DIR)Timer.o


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

server	: $(SRCS_OBJ)
	$(CC)  $(OBJ_FILES) $(FLAGS) -o serv
	@echo "\033[1;32m[G++][EXC] creation de -> $@\033[00m"

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
