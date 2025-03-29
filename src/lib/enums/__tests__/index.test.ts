
import { EnumUtils } from '..';
import { ChatMode, ChatPosition, TokenEnforcementMode, MessageRole, MessageType, MessageStatus } from '@/types/chat/enums';

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
    expect(EnumUtils.stringToTokenEnforcementMode('none')).toBe(TokenEnforcementMode.None);
    expect(EnumUtils.stringToTokenEnforcementMode('warn')).toBe(TokenEnforcementMode.Warn);
  });
  
  it('converts string to MessageRole enum', () => {
    expect(EnumUtils.stringToMessageRole('user')).toBe(MessageRole.User);
    expect(EnumUtils.stringToMessageRole('assistant')).toBe(MessageRole.Assistant);
  });
  
  it('converts string to MessageType enum', () => {
    expect(EnumUtils.stringToMessageType('text')).toBe(MessageType.Text);
    expect(EnumUtils.stringToMessageType('image')).toBe(MessageType.Image);
  });
  
  it('converts string to MessageStatus enum', () => {
    expect(EnumUtils.stringToMessageStatus('sent')).toBe(MessageStatus.Sent);
    expect(EnumUtils.stringToMessageStatus('error')).toBe(MessageStatus.Error);
  });
  
  it('gets chat mode label', () => {
    expect(EnumUtils.getChatModeLabel(ChatMode.Dev)).toBe('Developer');
    expect(EnumUtils.getChatModeLabel(ChatMode.Image)).toBe('Image');
  });
  
  it('gets message role label', () => {
    expect(EnumUtils.getMessageRoleLabel(MessageRole.User)).toBe('User');
    expect(EnumUtils.getMessageRoleLabel(MessageRole.Assistant)).toBe('Assistant');
  });
  
  it('gets message type label', () => {
    expect(EnumUtils.getMessageTypeLabel(MessageType.Text)).toBe('Text');
    expect(EnumUtils.getMessageTypeLabel(MessageType.Code)).toBe('Code');
  });
});
