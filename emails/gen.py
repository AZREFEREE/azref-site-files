# Builds the branded Triggered Email HTML for azref.com (paste each .html into the email builder's HTML block).
# Variables use Wix Triggered Email syntax ${name}. Run: python3 emails/gen.py
import json, os
D=os.path.dirname(os.path.abspath(__file__))
LOGO="https://cdn.jsdelivr.net/gh/AZREFEREE/azref-site-files@main/img/asra-logo.png"
def label(t): return f'<div style="font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#3b3f45;">{t}</div>'
def val(v,big=False,pre=False):
    st="margin:0 0 12px;"+("font-size:18px;font-weight:bold;" if big else "")+("white-space:pre-wrap;" if pre else "")
    return f'<div style="{st}">{v}</div>'
def card(rows,accent="#f6c915"):
    inner="\n".join(label(k)+"\n"+val(v,b,p) for k,v,b,p in rows)
    return f'''<tr><td style="padding:16px 28px 6px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f3f1;border-left:6px solid {accent};border-radius:4px;">
<tr><td style="padding:18px 20px 6px;color:#121417;font-size:15px;line-height:1.5;">
{inner}
</td></tr></table></td></tr>'''
def para(html,pad="18px 28px 6px"):
    return f'<tr><td style="padding:{pad};color:#121417;font-size:16px;line-height:1.55;">{html}</td></tr>'
def button(text,href):
    return f'''<tr><td style="padding:22px 28px 30px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:#f6c915;border:3px solid #121417;border-radius:6px;"><a href="{href}" style="display:inline-block;padding:12px 22px;color:#121417;font-size:15px;font-weight:bold;text-decoration:none;">{text}</a></td>
</tr></table></td></tr>'''
def shell(kicker,body,footer):
    return f'''<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f2f3f1;font-family:Arial,Helvetica,sans-serif;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:3px solid #121417;border-radius:6px;">
<tr><td style="background:#121417;padding:22px 28px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="padding-right:14px;vertical-align:middle;"><img src="{LOGO}" width="56" height="56" alt="ASRA" style="display:block;border:0;"></td>
<td style="vertical-align:middle;"><div style="color:#f6c915;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">{kicker}</div><div style="color:#ffffff;font-size:20px;font-weight:bold;line-height:1.2;">Arizona State Referee Administration</div></td>
</tr></table></td></tr>
<tr><td style="padding:0;font-size:0;line-height:0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td height="8" style="background:#f6c915;height:8px;">&nbsp;</td><td height="8" style="background:#8bc26a;height:8px;">&nbsp;</td><td height="8" style="background:#35a4e4;height:8px;">&nbsp;</td><td height="8" style="background:#ef5a3c;height:8px;">&nbsp;</td>
</tr></table></td></tr>
{body}
<tr><td style="background:#121417;padding:18px 28px;color:#c9ccd1;font-size:12px;line-height:1.5;">
<b style="color:#ffffff;">Arizona State Referee Administration</b><br>
The U.S. Soccer State Referee Program for Arizona &middot; <a href="https://www.azref.com" style="color:#f6c915;text-decoration:none;">azref.com</a><br>
{footer}
</td></tr>
</table></td></tr></table>'''
H1=lambda t: f'<p style="margin:0 0 14px;font-size:24px;font-weight:bold;line-height:1.25;">{t}</p>'
P=lambda t,last=False: f'<p style="margin:0{" 0 14px" if not last else ""};">{t}</p>'
A=lambda href,t: f'<a href="{href}" style="color:#1d2a5b;font-weight:bold;">{t}</a>'
CMS="https://manage.wix.com/dashboard/027a94fc-358b-449f-bd85-3884dc304077/database/data/"
T={}
T['contact-confirm']=dict(subject="We got your message (${ref})",html=shell("Message received",
  para(H1("Got it, ${name}. Thanks for reaching out.")+P("Your message made it to the ASRA team. A real person will read it and get back to you as soon as we can.")+P("Here&rsquo;s a copy for your records:",True),"30px 28px 8px")+
  card([("Reference","${ref}",True,False),("Topic","${topic}",False,False),("Your message","${message}",False,True)])+
  para(P('Need to add something? Just reply to this email. Replies go straight to '+A("mailto:admin@azref.com","admin@azref.com")+'. Keep your reference number handy so we can find your message fast.',True))+
  button("Visit azref.com","https://www.azref.com"),
  "You&rsquo;re getting this because you sent us a message through the contact form on azref.com."))
T['contact-admin']=dict(subject="New message ${ref}: ${topic} from ${name}",html=shell("New contact message",
  para(H1("${name} sent a message")+P('Reply to them at '+A("mailto:${email}","${email}")+' and mention reference <b>${ref}</b>. The message is also saved in the CMS under <b>Contact Messages</b>.',True),"30px 28px 8px")+
  card([("Reference","${ref}",True,False),("Topic","${topic}",False,False),("Message","${message}",False,True)])+
  card([("Name","${name}",False,False),("Email","${email}",False,False),("Phone","${phone}",False,False),("Role","${role}",False,False),("USSF ID","${ussf}",False,False),("More details","${details}",False,True)],"#35a4e4")+
  button("Open Contact Messages in the CMS",CMS+"ContactMessages"),
  "Sent automatically by the contact form on azref.com."))
T['reg-confirm']=dict(subject="You're registered: ${event} (${ref})",html=shell("Registration confirmed",
  para(H1("You&rsquo;re in, ${name}.")+P("Thanks for registering. Here are your details. Keep your reference number handy in case anything comes up.",True),"30px 28px 8px")+
  card([("Event","${event}",True,False),("When","${when}",False,False),("Reference","${ref}",True,False),("Status","${status}",False,False),("Sessions","${sessions}",False,True)],"#8bc26a")+
  para(P('Need to change something or can&rsquo;t make it? Reply to this email (it goes to '+A("mailto:admin@azref.com","admin@azref.com")+') with your reference number and we&rsquo;ll update the head count.',True))+
  button("Visit azref.com","https://www.azref.com"),
  "You&rsquo;re getting this because you registered for an event on azref.com."))
T['reg-admin']=dict(subject="New registration ${ref}: ${event} - ${name}",html=shell("New event registration",
  para(H1("${name} registered for ${event}")+P('Status: <b>${status}</b>. Contact them at '+A("mailto:${email}","${email}")+'. The full list is in the CMS under <b>Event Registrations</b>.',True),"30px 28px 8px")+
  card([("Event","${event}",True,False),("When","${when}",False,False),("Reference","${ref}",True,False),("Sessions","${sessions}",False,True)],"#8bc26a")+
  card([("Name","${name}",False,False),("Email","${email}",False,False),("Phone","${phone}",False,False),("USSF ID","${ussf}",False,False),("More details","${details}",False,True)],"#35a4e4")+
  button("Open Event Registrations in the CMS",CMS+"EventRegistrations"),
  "Sent automatically by event registration on azref.com."))
for k,v in T.items():
    open(os.path.join(D,k+".html"),"w").write(v["html"])
json.dump({k:{"subject":v["subject"]} for k,v in T.items()},open(os.path.join(D,"subjects.json"),"w"),indent=1)
print("ok")
