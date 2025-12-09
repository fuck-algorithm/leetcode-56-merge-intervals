// 语音服务 - 使用浏览器原生 Web Speech API

class SpeechService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.enabled = true; // 默认开启
    this.voice = null;
    this.rate = 1.0;
    this.pitch = 1.0;
    this.volume = 1.0;
    
    // 等待voices加载
    this.voicesLoaded = false;
    if (this.synthesis) {
      this.synthesis.onvoiceschanged = () => {
        this.voicesLoaded = true;
        this.loadVoices();
      };
      // 有些浏览器需要手动触发
      this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.synthesis) return;
    
    const voices = this.synthesis.getVoices();
    
    // 优先选择中文语音
    const chineseVoice = voices.find(v => 
      v.lang.includes('zh') || v.lang.includes('CN')
    );
    
    this.voice = chineseVoice || voices[0];
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  setRate(rate) {
    this.rate = rate;
  }

  speak(text, language = 'zh') {
    if (!this.enabled || !this.synthesis || !text) return;

    // 停止当前播放
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语音参数
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = language === 'zh' ? 'zh-CN' : 'en-US';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    // 播放
    this.synthesis.speak(utterance);
  }

  stop() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }
}

const speechServiceInstance = new SpeechService();
export default speechServiceInstance;
