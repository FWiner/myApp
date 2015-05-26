//数组式声明服务之间的依赖
angular.module('demo.services')
    .factory('userSrv',['storage',function(storage) {
        var storageKey = 'user';
        return {
            doLogin:function(userData){
                if(''!= userData||undefined != userData){
                    alert('登录成功');
                    storage.set(storageKey, userData);
                }
                else{
                    alert('请输入用户名和密码');
                }


            }
        }
    }]);

//隐式声明服务之间的依赖  －－－－ 压缩之后会失效
//angular.module('demo.services')
//    .factory('userSrv',function(storage) {
//        var storageKey = 'user';
//        return {
//            doLogin:function(userData){
//                if(''!= userData||undefined != userData){
//                    alert('登录成功');
//                    storage.set(storageKey, userData);
//                }
//                else{
//                    alert('请输入用户名和密码');
//                }
//
//
//            }
//        }
//    });