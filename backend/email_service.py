"""
Email service for sending order notifications
"""
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from jinja2 import Template
from typing import Dict, Any
import logging

# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "noreply@pulgax3d.com")
FROM_NAME = os.getenv("FROM_NAME", "Pulgax 3D Store")

logger = logging.getLogger(__name__)

def send_email(to_email: str, subject: str, html_content: str, text_content: str = None):
    """Send email using SMTP"""
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = f"{FROM_NAME} <{FROM_EMAIL}>"
        msg['To'] = to_email

        # Add text content
        if text_content:
            text_part = MIMEText(text_content, 'plain', 'utf-8')
            msg.attach(text_part)

        # Add HTML content
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)

        # Send email
        if SMTP_USERNAME and SMTP_PASSWORD:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            logger.info(f"Email sent successfully to {to_email}")
            return True
        else:
            # For development - just log the email
            logger.info(f"EMAIL WOULD BE SENT TO: {to_email}")
            logger.info(f"SUBJECT: {subject}")
            logger.info(f"CONTENT: {html_content}")
            return True
            
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

def send_order_status_email(order: Dict[str, Any], new_status: str, note: str = ""):
    """Send order status update email"""
    
    status_messages = {
        'confirmed': {
            'subject': 'Encomenda Confirmada - #{order_number}',
            'title': 'Encomenda Confirmada!',
            'message': 'A sua encomenda foi confirmada e está a ser preparada.',
            'color': '#3B82F6'
        },
        'processing': {
            'subject': 'Encomenda em Processamento - #{order_number}',
            'title': 'A Preparar a Sua Encomenda',
            'message': 'A sua encomenda está a ser processada e será enviada em breve.',
            'color': '#8B5CF6'
        },
        'shipped': {
            'subject': 'Encomenda Enviada - #{order_number}',
            'title': 'Encomenda Enviada!',
            'message': 'A sua encomenda foi enviada e está a caminho.',
            'color': '#6366F1'
        },
        'delivered': {
            'subject': 'Encomenda Entregue - #{order_number}',
            'title': 'Encomenda Entregue!',
            'message': 'A sua encomenda foi entregue com sucesso. Obrigado pela sua compra!',
            'color': '#10B981'
        },
        'cancelled': {
            'subject': 'Encomenda Cancelada - #{order_number}',
            'title': 'Encomenda Cancelada',
            'message': 'A sua encomenda foi cancelada.',
            'color': '#EF4444'
        },
        'refunded': {
            'subject': 'Reembolso Processado - #{order_number}',
            'title': 'Reembolso Processado',
            'message': 'O reembolso da sua encomenda foi processado.',
            'color': '#6B7280'
        }
    }
    
    status_info = status_messages.get(new_status, {
        'subject': 'Atualização da Encomenda - #{order_number}',
        'title': 'Atualização da Encomenda',
        'message': f'O estado da sua encomenda foi atualizado para: {new_status}',
        'color': '#6B7280'
    })
    
    # Email template
    html_template = Template("""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{{ subject }}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: {{ color }}; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .status-badge { display: inline-block; background: {{ color }}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .items-table th { background: #f5f5f5; font-weight: bold; }
            .total { font-size: 18px; font-weight: bold; color: {{ color }}; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: {{ color }}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{{ title }}</h1>
                <p style="margin: 0; font-size: 18px;">Encomenda #{{ order.order_number }}</p>
            </div>
            
            <div class="content">
                <p style="font-size: 16px; margin-bottom: 20px;">Olá {{ order.customer.name }},</p>
                
                <p>{{ message }}</p>
                
                {% if note %}
                <div style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <strong>Nota:</strong> {{ note }}
                </div>
                {% endif %}
                
                <div class="order-info">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <h3 style="margin: 0;">Detalhes da Encomenda</h3>
                        <span class="status-badge">{{ status_text }}</span>
                    </div>
                    
                    <p><strong>Data:</strong> {{ order_date }}</p>
                    <p><strong>Email:</strong> {{ order.customer.email }}</p>
                    {% if order.shipping and order.shipping.tracking_number %}
                    <p><strong>Rastreio:</strong> {{ order.shipping.tracking_number }}</p>
                    {% endif %}
                    
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% for item in order.items %}
                            <tr>
                                <td>
                                    {{ item.product_name }}
                                    {% if item.selected_color %}<br><small>Cor: {{ item.selected_color }}</small>{% endif %}
                                    {% if item.selected_size %}<br><small>Tamanho: {{ item.selected_size }}</small>{% endif %}
                                </td>
                                <td>{{ item.quantity }}</td>
                                <td>€{{ "%.2f"|format((item.unit_price + (item.size_price_adjustment or 0)) * item.quantity) }}</td>
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                    
                    <div style="text-align: right; margin-top: 20px;">
                        <p class="total">Total: €{{ "%.2f"|format(order.totals.total if order.totals else order.total_amount) }}</p>
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:3000/my-orders" class="button">Ver Encomenda Online</a>
                </div>
                
                <p>Se tiver alguma questão sobre a sua encomenda, não hesite em contactar-nos.</p>
            </div>
            
            <div class="footer">
                <p><strong>Pulgax 3D Store</strong></p>
                <p>Email: info@pulgax3d.com | Telefone: +351 912 345 678</p>
                <p>Este é um email automático, por favor não responda.</p>
            </div>
        </div>
    </body>
    </html>
    """)
    
    # Format order date
    from datetime import datetime
    order_date = datetime.fromisoformat(order['created_at'].replace('Z', '+00:00')).strftime('%d/%m/%Y às %H:%M')
    
    # Render template
    html_content = html_template.render(
        subject=status_info['subject'].format(order_number=order['order_number']),
        title=status_info['title'],
        message=status_info['message'],
        note=note,
        color=status_info['color'],
        order=order,
        order_date=order_date,
        status_text=get_status_text(new_status)
    )
    
    # Send email
    subject = status_info['subject'].format(order_number=order['order_number'])
    customer_email = order['customer']['email']
    
    return send_email(customer_email, subject, html_content)

def get_status_text(status: str) -> str:
    """Get Portuguese status text"""
    status_map = {
        'pending': 'Pendente',
        'confirmed': 'Confirmada',
        'processing': 'Em Processamento',
        'shipped': 'Enviada',
        'delivered': 'Entregue',
        'cancelled': 'Cancelada',
        'refunded': 'Reembolsada'
    }
    return status_map.get(status, status)

def send_order_confirmation_email(order: Dict[str, Any]):
    """Send order confirmation email"""
    return send_order_status_email(order, 'confirmed', 
        "Obrigado pela sua compra! Iremos processar a sua encomenda e contactá-lo em breve.")