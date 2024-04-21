<script setup>
import { useRouter } from 'vue-router'
import PlayerView from '@/components/player/PlayerView.vue'

const router = useRouter()

let activeTab = 'discover'

const toggleActive = (tab) => {
  activeTab = tab
  router.push({ name: tab })
}
</script>

<template>
  <div>
    <RouterView></RouterView>
    <div class="bottom-nav">
      <router-link to="/discover" @click="toggleActive('discover')">
        <div :class="{ active: activeTab === 'discover' }">
          <div class="iconfont"><span>&#xe600;</span></div>
          <span>发现</span>
        </div>
      </router-link>
      <router-link to="/podcast" @click="toggleActive('podcast')">
        <div :class="{ active: activeTab === 'podcast' }">
          <div class="iconfont"><span>&#xe609;</span></div>
          <span>播客</span>
        </div>
      </router-link>
      <router-link to="/me" @click="toggleActive('me')">
        <div :class="{ active: activeTab === 'me' }">
          <div class="iconfont"><span>&#xe61c;</span></div>
          <span>我的</span>
        </div>
      </router-link>
      <router-link to="/follow" @click="toggleActive('follow')">
        <div :class="{ active: activeTab === 'follow' }">
          <div class="iconfont"><span>&#xe6cf;</span></div>
          <span>关注</span>
        </div>
      </router-link>
      <router-link to="/community" @click="toggleActive('community')">
        <div :class="{ active: activeTab === 'community' }">
          <div class="iconfont"><span>&#xe624;</span></div>
          <span>社区</span>
        </div>
      </router-link>
    </div>
    <PlayerView></PlayerView>
  </div>
</template>

<style lang="scss" scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  height: 60px;
  padding-top: 3px;
  border-top: 1px solid rgb(234, 234, 234);
  background-color: white;
  img {
    height: 30px;
  }
}

.bottom-nav a {
  flex: 1;
  text-decoration: none;
  color: #333;
  span {
    margin-top: -5px;
  }
}

.bottom-nav div {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bottom-nav div.active {
  .iconfont {
    font-size: 20px;
    background-color: rgb(255, 66, 66);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      color: white;
      margin-bottom: 2px;
    }
  }
  span {
    margin-top: 2px;
    color: red;
  }
}
</style>
