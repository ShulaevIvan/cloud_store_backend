from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import CloudUser, CloudUserFiles

class CloudUserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'password', 'email',]

class CloudUsersSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUser
        fields = ['id', 'username', 'full_name', 'email', 'is_staff']

class CloudUserFilesSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = CloudUserFiles
        # fields = ['id', 'file_name', 'file_type', 'file_url', 'user', 'file_comment']
        fields = ['id', 'file_name', 'file_type', 'file_url', 'user', 'file_comment']

        def create(self, validated_data):
            print(validated_data)
            return super().create(validated_data)

        def update(self, instance, validated_data):
            print(instance)
            print(validated_data)

            # positions = validated_data.pop('positions')
            # stock = super().update(instance, validated_data)

            # for position in positions:
            #     stock_product, create_tuple = StockProduct.objects.update_or_create(stock=stock, product=position['product'])
            #     stock_product.quantity = position['quantity']
            #     stock_product.price = position['price']
            #     stock_product.save()

            # return stock