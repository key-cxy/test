<template>
    <div>
      <el-tabs :value="0" style="margin-left: 20px" @tab-click="handleClick">
        <el-tab-pane v-for="item in questionList" :label="item.name" :name="item.id+''" :key="item.id">
          <disposal-table  v-bind:id="item.id" v-bind:flag="flag" class=tab-body></disposal-table>
        </el-tab-pane>
      </el-tabs>
<!--      <Tabs :value="0" style="margin-left: 20px">-->
<!--        <TabPane v-for="item in questionList" :label="item.name" :name="item.id+''" :key="item.id">-->
<!--          <disposal-table v-bind:id="item.id"></disposal-table>-->
<!--        </TabPane>-->
<!--      </Tabs>-->
    </div>
</template>

<script>
  import disposalTable from "./disposalTable";
  import {handleSimpleList} from "@/api/question/bpm"
  import {
    handleList,
  } from "@/api/event/disposal";
    export default {
      name: "eventDisposal",
      components: {
        disposalTable
      },
      mounted() {
        this.handleSimpleList()
      },
      data () {
        return {
          questionList:[
            {
              id: 0,
              name:'全部'
            }
          ],
          tableData:[],
          dataTotal:0,
          flag: 0
        }
      },
      methods:{
        handleClick(tab, event) {
          console.log(tab.name);
          this.flag = tab.name
        },
        handleSimpleList(){
          handleSimpleList().then(res =>{
            res.data.forEach(i =>{
              this.questionList.push(i)
            })
            console.log('ques',this.questionList)
            // const params = {
            //   caseStatus: 1,
            //   pageNo: 1,
            //   pageSize: 10,
            // };
            // handleList(params)
            //   .then((res) => {
            //     if (res.code == 200) {
            //       this.tableData = res.data.list || [];
            //       this.dataTotal = res.data.total || 0;
            //     } else {
            //       this.$Message.error({
            //         content: res.data.msg,
            //         duration: 2,
            //       });
            //     }
            //   })
            //   .catch((error) => {
            //     console.log(error);
            //   });
          })
        }
      }
    }
</script>

<style scoped>
  .tab-body {
    overflow-y: auto;
    height: 80vh;
  }
</style>
