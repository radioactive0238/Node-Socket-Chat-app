var app =  angular.module('chatApp',['ngSanitize']);

app.controller("chatAppController",function($scope,$http){

	var socket=io();
	$scope.userList=[];
	$scope.list_colors = [ "blue", "orange", "red", "pink", "purple", "cyan", "orange", "green", "Chartreuse ", "Coral ", "Chocolate","DarkGreen","LightGreen","Plum","SlateGray","Tomato","darkTurquoise" ];

	$scope.checkUser = function () {
		if($scope.username==null){
				$scope.myText ='Please enter username first';
			}
		else{
			if($scope.userList.indexOf($scope.username)!== -1)
				$scope.myText ='Username already taken, try another .';
			else {
				$("#myModal").modal('hide');
				socket.emit('adduser', $scope.username);
			}
		}
	}

	$scope.sendMessage= function (){
		if($scope.msgVal==null){
			alert('Enter message first');
		}
		else{
			var msgtime=new Date;
			msgtime=msgtime.getHours() + ':' + msgtime.getMinutes();
			$('#nav-chat > ul').append('<li class="r-message"><div class="row userdata"><div class="col-xs-8">You</div><div class="col-xs-4" style="text-align:right">'+ msgtime +'</div></div>'+$scope.msgVal+'</li>');
			socket.emit('chat message',$scope.msgVal);
			$scope.msgVal='';
		}
	}

	socket.on('list', function(usernames){
		$scope.userList=usernames;
		$("#myModal").modal('show');
    });

	socket.on('chat message', function(msg,msgdby){
		var msgtime=new Date;
		msgtime=msgtime.getHours() + ':' + msgtime.getMinutes();
		$('#nav-chat > ul').append('<li><div class="row userdata"><div class="col-xs-8">'+msgdby+'</div><div class="col-xs-4" style="text-align:right">'+ msgtime +'</div></div>'+msg+'</li>');
	});

	socket.on('userAdd', function(username,usernames){
		$scope.userList=usernames;
		$scope.$apply();
		$('#nav-chat > ul').append('<li class="logmsg">'+username+' joined the chat.'+' </li>');
	//	$('#nav-logs > ul').append('<li class="logMessages">'+username +' joined the chat </li>');
	});

	socket.on('userSub', function(username,usernames){
		$scope.userList=usernames;
		$scope.$apply();
		$('#nav-chat > ul').append('<li class="logmsg">'+username+' left the chat.'+' </li>');
	//	$('#nav-logs > ul').append('<li class="logMessages">'+ username +' left the chat </li>');
	});
});
