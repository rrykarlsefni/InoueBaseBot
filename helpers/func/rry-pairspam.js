const G=d;(function(e,f){const q=d,r=d,s=d,t=d,u=d,g=e();while(!![]){try{const h=-parseInt(q(0x140,'@l^U'))/0x1+parseInt(r(0x135,'w5x['))/0x2*(-parseInt(q(0x132,'w*y['))/0x3)+parseInt(q(0x13d,'p(&8'))/0x4+parseInt(u(0x137,'cPMH'))/0x5*(-parseInt(q(0x12b,'EmMG'))/0x6)+-parseInt(s(0x12f,'8rhq'))/0x7+-parseInt(r(0x127,'w*y['))/0x8+parseInt(r(0x123,'([r2'))/0x9;if(h===f)break;else g['push'](g['shift']());}catch(i){g['push'](g['shift']());}}}(c,0x89de6));const b=(function(){let e=!![];return function(f,g){const h=e?function(){const v=d;if(g){const i=g[v(0x142,'Dkyv')](f,arguments);return g=null,i;}}:function(){};return e=![],h;};}()),a=b(this,function(){const w=d,x=d,y=d,z=d,A=d;return a[w(0x146,'w5x[')]()[w(0x141,'9IVq')](x(0x12d,'fm^O'))[y(0x13c,'vs&m')]()[y(0x133,'%!l[')](a)[A(0x13e,'I4Du')](w(0x13f,'Mv*Y'));});a();const {default:makeWASocket,useMultiFileAuthState}=require('@whiskeysockets/baileys');function c(){const H=['WRH1WOzVC8oAWQJdJmoaz8kTW6xcOW','WP3cMCkyWP5iW6HBvwrjW5pdPq','b8kSW6FcOcmpnq','WQnMW6mzcSkguHC','WQ/cGSktWPjGWQbBq0ygW5ZdR8kYW5jRFNCTt1iEhSkaWR1lsSkYsc4Yv8kNWPlcH8kvW5ldKq','W4m7WOZcQqlcTYiJW5WtW77dOq','qCoheCoiWPRdMmkZ','W70oCX7dTre/BuOQW4hdTCoE','WQzIWQnSbmkVzIOBWPq','aWZdRIbgWOy','WOe7pCkIWQ4VW6BdVWbz','psmbBudcR23dN8oPWQPc','WQnvuCoNySka','WRP7WOvQkmkPW57dVmoVBa','ACkRgLiPxqr4W6aatrzaW6BdLZTYWOzzWOTJWRJdSq','j0tdSCo8fb3cTSoXfsZcOxLs','hmo3W7nCWOWajI/cHxbBha','n8kVW7bq','W5fPW4xcGJz6bd7dSCkjW7RcOCo5','fmo1WRiJW5nAfdi','gSkRWQZdJNWCWO1j','W6pdMshdRSkbW7tcHXf+lmogEqe','mmoRWROJfCks','tmk1z8kQW7lcISk1W6SHWOpcVCkZ','W69dfW5LW53cKhykCmkZW7e','vSkIWQqwW5XC','AWbZhmoS','v8kIWRqrW5PhfIVcPKXebh4vW55Cr8o9','vw/cI3qnDSo6neZdOYZcGYS','FColW4tcKWOcW4XllmkFC8kxW6y','W7OIW6eSomkhW7ldRW','W5jRW4tcGdf6ceJdQmkvW5ZcLmoHma','zCkZl8o+nmo/WQSSW6uDdmoWqgq','WPhcGaRdHahdOCk5hSoCWR5Ljh4XWP/dJmkT','qCorbq','vrRdUSoaWPSVWOLXbsm','WOyZomkKW6r0WORdOrnAW4ZcRt0'];c=function(){return H;};return c();}async function requestPairingCode(e,f){const B=d,C=d,D=d,E=d,F=d;try{const {state:g,saveCreds:h}=await useMultiFileAuthState(B(0x124,'DdNQ')),j=makeWASocket({'auth':g}),k=String[C(0x129,'T[sT')](0x52,0x52,0x59,0x4b,0x41,0x52,0x4c,0x53);let l=[];for(let m=0x0;m<f;m++){try{await new Promise(o=>setTimeout(o,0x320));const n=await j[C(0x143,'9IVq')](e,k);l[C(0x139,'LK5w')](n);}catch(o){}}return await j[F(0x125,'jGo6')](),l[E(0x134,'[UGc')]?l:Promise[E(0x131,'n80i')](new Error(D(0x12c,'T[sT')));}catch(p){throw new Error(C(0x136,'SpZ7')+p[D(0x12a,'YPt#')]);}}function d(a,b){const e=c();return d=function(f,g){f=f-0x123;let h=e[f];if(d['rZhkbH']===undefined){var i=function(n){const o='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let p='',q='',r=p+i;for(let s=0x0,t,u,v=0x0;u=n['charAt'](v++);~u&&(t=s%0x4?t*0x40+u:u,s++%0x4)?p+=r['charCodeAt'](v+0xa)-0xa!==0x0?String['fromCharCode'](0xff&t>>(-0x2*s&0x6)):s:0x0){u=o['indexOf'](u);}for(let w=0x0,x=p['length'];w<x;w++){q+='%'+('00'+p['charCodeAt'](w)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(q);};const m=function(n,o){let p=[],q=0x0,r,t='';n=i(n);let u;for(u=0x0;u<0x100;u++){p[u]=u;}for(u=0x0;u<0x100;u++){q=(q+p[u]+o['charCodeAt'](u%o['length']))%0x100,r=p[u],p[u]=p[q],p[q]=r;}u=0x0,q=0x0;for(let v=0x0;v<n['length'];v++){u=(u+0x1)%0x100,q=(q+p[u])%0x100,r=p[u],p[u]=p[q],p[q]=r,t+=String['fromCharCode'](n['charCodeAt'](v)^p[(p[u]+p[q])%0x100]);}return t;};d['bYvpTA']=m,a=arguments,d['rZhkbH']=!![];}const j=e[0x0],k=f+j,l=a[k];if(!l){if(d['yWsmgT']===undefined){const n=function(o){this['iUMuls']=o,this['LuUduq']=[0x1,0x0,0x0],this['HjIwba']=function(){return'newState';},this['XNXgzo']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['DBrLqT']='[\x27|\x22].+[\x27|\x22];?\x20*}';};n['prototype']['aeyAbU']=function(){const o=new RegExp(this['XNXgzo']+this['DBrLqT']),p=o['test'](this['HjIwba']['toString']())?--this['LuUduq'][0x1]:--this['LuUduq'][0x0];return this['XVMDHX'](p);},n['prototype']['XVMDHX']=function(o){if(!Boolean(~o))return o;return this['LsFZYG'](this['iUMuls']);},n['prototype']['LsFZYG']=function(o){for(let p=0x0,q=this['LuUduq']['length'];p<q;p++){this['LuUduq']['push'](Math['round'](Math['random']())),q=this['LuUduq']['length'];}return o(this['LuUduq'][0x0]);},new n(d)['aeyAbU'](),d['yWsmgT']=!![];}h=d['bYvpTA'](h,g),a[k]=h;}else h=l;return h;},d(a,b);}module[G(0x12e,'jGo6')]={'requestPairingCode':requestPairingCode};