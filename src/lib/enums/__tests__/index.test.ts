
import { EnumUtils } from '..';
import { ChatMode, ChatPosition, TokenEnforcementMode } from '@/types/chat/enums';

describe('EnumUtils', () => {
  it('converts string to ChatMode enum', () => {
    expect(EnumUtils.stringToChatMode('chat')).toBe(ChatMode.Chat);
    expect(EnumUtils.stringToChatMode('dev')).toBe(ChatMode.Dev);
  });
  
  it('handles ChatMode enum input', () => {
    expect(EnumUtils.stringToChatMode(ChatMode.Image)).toBe(ChatMode.Image);
  });
  
  it('converts string to ChatPosition enum', () => {
    expect(EnumUtils.stringToChatPosition('bottom-right')).toBe(ChatPosition.BottomRight);
  });
  
  it('converts string to TokenEnforcementMode enum', () => {
    expect(EnumUtils.stringToTokenEnforcementMode('never')).toBe(TokenEnforcementMode.Never);
    expect(EnumUtils.stringToTokenEnforcementMode('warn')).toBe(TokenEnforcementMode.Warn);
  });
  
  it('gets chat mode label', () => {
    expect(EnumUtils.getChatModeLabel(ChatMode.Dev)).toBe('Developer');
    expect(EnumUtils.getChatModeLabel(ChatMode.Image)).toBe('Image');
  });
});
