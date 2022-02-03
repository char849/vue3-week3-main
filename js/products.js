import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//宣告productModal、delProductModal空值或用null(有被賦予值，之後清空值用途)
let productModal = null;
let delProductModal = null;

//加入data欄位:url path products isNew tempProduct:{imagesUrl:[]}
createApp({
  data() {
    return {
      url: 'https://vue3-course-api.hexschool.io/v2',
      path: 'charlotte-hexschool',
      products: [],
      isNew: false,
      tempProduct: {
        imagesUrl: [],
      },
    }
  },
  
  methods: {
    //checkApi() {}，用post，宣告url，失敗時轉址回login頁面
    checkApi() {
      const url = `${this.url}/api/user/check`;
      axios.post(url)
        .then(() => {
          this.getData();          
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html';
        })
    },
    

    // get取得產品列表 getData() {}，宣告url api產品列表路徑，成功取得資料，失敗顯示錯誤訊息
    getData() {
      const url = `${this.url}/api/${this.path}/admin/products/all`;
      axios.get(url)
        .then((res) => {
          this.products = res.data.products;                               
        })
        .catch((err) => {
          alert(err.data.message);
        })              
    },

    // reverseArray() {
    //   this.products.reverse();
    // },

    // 取得新增或修改單筆資料判斷 updateProduct() {}，宣告url api路徑及一個'共用'變數指向post新增、put修改
    updateProduct() {
      let url = `${this.url}/api/${this.path}/admin/product`;
      let httpApi = 'post'; 

      //if !isNew，為put修改
      if (!this.isNew) {
        url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
        httpApi = 'put';
      }

      //post 新增資料時，要用物件包物件的寫法，照後台格式
      //axios[共用變數]共用變數(參數, 參數)
      axios[httpApi](url, { data: this.tempProduct })
        .then((res) => {
        alert(res.data.message);
        productModal.hide();
        this.getData();
        })
        .catch((err) => {
        alert(err.data.message);
        })
    },

    //新增編輯共用一個openModal(isNew, item) {} modal，用 isNew 欄位判斷是:new, edit, delete
    openModal(isNew, item) {
      //if isNew 等於 new，寫入新增料
      if (isNew === 'new') {
        this.tempProduct = {
          //此為資料格式，要打入html那邊才能運用有打入的欄位
          imagesUrl: [],   
        };
        // isNew = true 顯示新的 modal，顯示modal
        this.isNew = true;
        productModal.show();
        //else if isNew 等於 edit，用淺拷的方式將資料帶入
      } else if (isNew === 'edit') {
        //用淺拷的方式比較保險,防止modal不小心關閉時資料被覆蓋
        //this.tempProduct = { ...item };  
        this.tempProduct = JSON.parse(JSON.stringify(item));       
        //深拷貝，避免 imagesUrl 陣列會有傳參考問題
        //isNew = false，為編輯的model，帶入資料後顯示modal
        this.isNew = false;
        productModal.show();
        //刪除資料是另一個 modal,所以不用 isNew 判斷
        //else if isNew 等於 delete，帶入資料後顯示 modal

        //預先處理:如果沒有陣列，就新增 imagesUrl 陣列並且給予一個空值
        if(!this.tempProduct.imagesUrl){
          this.tempProduct.imagesUrl = []
        }
      } else if (isNew === 'delete') {
        this.tempProduct = JSON.parse(JSON.stringify(item));
        delProductModal.show()
      }
    },

    //刪除產品
    //delProduct() {}，宣告 delete 的 url 路徑
    delProduct() {      
      const url = `${this.url}/api/${this.path}/admin/product/${this.tempProduct.id}`;
      axios.delete(url)
        .then((res) => {
        alert(res.data.message);
        delProductModal.hide();
        this.getData();        
      })
      //失敗結果
        .catch((err) => {
        alert(err.data.message);
      })
    },

    //新增圖片
    //createImages() {}，新增imagesUrl空陣列，再push出來
    // createImages() {
    //   this.tempProduct.imagesUrl = [];
    //   this.tempProduct.imagesUrl.push('');
    // },    
      
  },

  //生命週期 mounted() {}
  //抓出二種modal動元素#productModal #delProductModal，並加入keyboard、backdrop屬性
  mounted() {
    
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false,  //防止按到esc不小心關閉model
      backdrop: 'static' //指定static在單擊時不關閉模式的背景
    });

    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false,
      backdrop: 'static'  
    });

    

    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    
    //執行驗證登入Token，執行checkApi()  
    this.checkApi();        
  }
  
  
}).mount('#app');
