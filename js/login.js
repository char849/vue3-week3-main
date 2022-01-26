import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

createApp({
    data() {
      return {
        user: {
          username: '',
          password: '',
        },
      }
    },
    methods: {
      login() {
        const api = 'https://vue3-course-api.hexschool.io/v2/admin/signin';
        axios.post(api, this.user)
        //成功的結果
        .then((res) => {
          //取出token
          const { token, expired } = res.data;
          // 儲存登入的cookie token資訊
          // expires 設置有效時間          
          document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
          //轉址的動作          
          window.location = 'index.html';
        })
        //失敗結果，並回傳錯誤訊息
        .catch((err) => {  
          alert(err.response.data.message);
        });
      },
    },
  }).mount('#app');