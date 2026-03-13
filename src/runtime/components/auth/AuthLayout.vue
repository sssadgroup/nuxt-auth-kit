<template>
  <div class="auth-layout">
    <div class="auth-layout__left">
      <div class="auth-layout__form-inner">
        <slot />
      </div>
    </div>

    <div class="auth-layout__right">
      <img :src="image || DEFAULT_IMAGE" :alt="appName" class="auth-layout__bg-image" />
      <div class="auth-layout__overlay" />
      <div class="auth-layout__content">
        <div>
          <slot name="brand">
            <h1 class="auth-layout__app-name">{{ appName }}</h1>
            <p class="auth-layout__app-tagline">{{ appTagline }}</p>
          </slot>
        </div>
        <div class="auth-layout__quote-card">
          <div class="auth-layout__quote-mark">"</div>
          <blockquote class="auth-layout__quote-text">{{ quote.text }}</blockquote>
          <div class="auth-layout__quote-mark auth-layout__quote-mark--close">"</div>
          <div class="auth-layout__quote-author">
            <div v-if="quote.avatar" class="auth-layout__avatar">
              <img :src="quote.avatar" :alt="quote.author" />
            </div>
            <div v-else class="auth-layout__avatar auth-layout__avatar--initial">
              <span>{{ quote.author.charAt(0) }}</span>
            </div>
            <div>
              <p class="auth-layout__author-name">{{ quote.author }}</p>
              <p class="auth-layout__author-location">{{ quote.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const DEFAULT_IMAGE =
  "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg";

withDefaults(
  defineProps<{
    appName?: string;
    appTagline?: string;
    image?: string;
    quote?: {
      text: string;
      author: string;
      location: string;
      avatar?: string;
    };
  }>(),
  {
    appName: "MonApp",
    appTagline: "La solution simple pour gérer votre activité.",
    image: undefined,
    quote: () => ({
      text: "Une expérience fluide et agréable. La plateforme rend tout si simple.",
      author: "Alex Mitchell",
      location: "Paris, France",
    }),
  }
);
</script>

<style scoped>
.auth-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.auth-layout__left {
  flex: 0 0 55%;
  width: 55%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #eeeee6;
  /* background-color: white; */
  box-sizing: border-box;
}

.auth-layout__form-inner {
  width: 100%;
  max-width: 420px;
}

.auth-layout__right {
  flex: 0 0 45%;
  width: 45%;
  position: relative;
  overflow: hidden;
}

@media (max-width: 1023px) {
  .auth-layout__right {
    display: none;
  }
  .auth-layout__left {
    flex: 0 0 100%;
    width: 100%;
  }
}

.auth-layout__bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.auth-layout__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.52);
}

.auth-layout__content {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 3.5rem;
}

.auth-layout__app-name {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 0.5rem;
  line-height: 1.2;
}

.auth-layout__app-tagline {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.6;
  margin: 0;
}

.auth-layout__quote-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  padding: 2rem;
}

.auth-layout__quote-mark {
  color: #f59e0b;
  font-size: 3rem;
  font-family: Georgia, serif;
  line-height: 1;
}

.auth-layout__quote-mark--close {
  text-align: right;
  margin-bottom: 1.25rem;
}

.auth-layout__quote-text {
  font-size: 1.05rem;
  font-weight: 500;
  color: #fff;
  line-height: 1.65;
  margin: 0.25rem 0;
}

.auth-layout__quote-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.auth-layout__avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.auth-layout__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.auth-layout__avatar--initial {
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-layout__avatar--initial span {
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
}

.auth-layout__author-name {
  font-weight: 600;
  color: #fff;
  margin: 0;
  font-size: 0.9rem;
}

.auth-layout__author-location {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.55);
  margin: 0;
}
</style>
