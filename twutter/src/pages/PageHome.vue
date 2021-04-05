<template>
  <q-page class = "relative-position">
    <q-scroll-area class = "absolute full-width full-height" >
      <div class = "q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class = "col">
          <q-input class = "new-twuut" autogrow bottom-slots v-model = "newTwuutContent"  placeholder="What's happening" counter maxlength="280" >
          <template v-slot:before>
            <q-avatar size = "xl">
              <img src="https://cdn.quasar.dev/img/avatar5.jpg">
            </q-avatar>
          </template>
        </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn @click = "addNewTwuut" :disable = "!newTwuutContent" class = "q-mb-lg" unelevated rounded no-caps color="primary" label="Twuut" />
        </div>
      </div>

      <q-separator class = "divider" size = "10px" color = "grey-2" />

      <q-list separator>
        <transition-group appear enter-active-class="animated zoomIn slow" leave-active-class="animated zoomOut slow"> 
          <q-item class = " twuut q-py-md" v-for = "twuut in twuuts" :key= "twuut.id">
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar5.jpg">
              </q-avatar>
            </q-item-section>

           <q-item-section>
              <q-item-label class = "text-subtitle1">
                <strong>Anton Rajković</strong>
                <span class="text-grey-7">@Anton_Rajković</span>
                <br class = "lt-md"/>
                &bull; {{twuut.date | relativeDate}}
              </q-item-label>
              <q-item-label class = "twuut-content text-body1">
                {{twuut.content}}
              </q-item-label>
             <div class="twuut-icons row justify-between q-mt-sm">
                <q-btn flat round color="grey" icon="fa fa-comments" size = "sm" />
                <q-btn flat round color="grey" icon="fas fa-retweet" size = "sm" />
                <q-btn @click = "toggleTwuut(twuut)" flat round :color = "twuut.hearted ? 'pink' : 'grey' " :icon = "twuut.hearted ? 'fas fa-heart' : 'far fa-heart' "  size = "sm" />
               <q-btn @click = "deleteTwuut(twuut)" flat round color="grey" icon="fa fa-trash" size = "sm" />
              </div>
            </q-item-section>

          </q-item>
        </transition-group>
      </q-list>
    
   </q-scroll-area>
  </q-page>
</template>

<script>
import { formatDistance} from 'date-fns'
import db from 'src/boot/firebase'

export default {
  name: 'PageHome',
  data(){
    return{
      newTwuutContent:'',
      twuuts: [
      ],
    }
  },
  filters:{
    relativeDate(value){
      return formatDistance(value, new Date())
    }
  },
  methods:{
    addNewTwuut(){
      let newTwuut = {
        content: this.newTwuutContent,
        date: Date.now(),
        hearted: false
      }

      //this.twuuts.unshift(newTwuut)
      db.collection('twuuts').add(newTwuut).then((docRef) => {
        console.log("Document written with ID: ", docRef.id)
      }).catch((error) => {
        console.error("Error adding document: ", error)
      })
      this.newTwuutContent = ''
    },
    deleteTwuut(twuut){
      db.collection('twuuts').doc(twuut.id).delete().then(() => {
         console.log("Document successfully deleted!");
      }).catch((error) => {
        console.error("Error removing document: ", error);
      })
    },
    toggleTwuut(twuut){
      db.collection('twuuts').doc(twuut.id).update({
        hearted: !twuut.hearted
      })
      .then(() => {
        console.log("Document successfully updated!")
      })
      .catch((error) => {
         // The document probably doesn't exist.
         console.error("Error updating document: ", error)
      })
    }
  },
  mounted(){
      db.collection('twuuts').orderBy('date').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
            let twuutChange = change.doc.data()
            twuutChange.id = change.doc.id
            if (change.type === 'added') {
              this.twuuts.unshift(twuutChange)
            }
            if (change.type === 'modified') {
              let index = this.twuuts.findIndex(twuut => twuut.id === twuutChange.id)
              Object.assign(this.twuuts[index],twuutChange)
            }
            if (change.type === 'removed') {
                let index = this.twuuts.findIndex(twuut => twuut.id === twuutChange.id)
                this.twuuts.splice(index,1)
            }
          })
      })
    }
}
</script>

<style lang="sass">
  .new-twuut
    textarea
      font-size:19px
      line-height:1.4 !important
  .divider
    border-top:1px solid
    border-bottom: 1px solid
    border-color: $grey-4
  .twuut-content
    white-space:pre-line
  
  .twuut:not(:first-child)
    border-top: 1px solid rgba(0, 0, 0, 0.12)
  .twuut-icons
    margin-left:-5px
</style>